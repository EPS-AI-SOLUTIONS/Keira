"""
Keira - Inpainting Worker
Regis Architecture v2.9.0

Processes video frames using LaMa ONNX model.
Reads frames from input directory, applies inpainting mask, outputs processed frames.
"""

from __future__ import annotations

import argparse
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import onnxruntime as ort


def parse_args() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Inpaint video frames using LaMa model"
    )
    parser.add_argument("--frames", required=True, help="Input frames directory")
    parser.add_argument("--out", required=True, help="Output frames directory")
    parser.add_argument("--roi", required=True, help="ROI as x,y,width,height")
    parser.add_argument("--model", required=True, help="Path to LaMa ONNX model")
    parser.add_argument("--mask", required=True, help="Path to mask image")
    parser.add_argument("--ext", default=".png", help="Frame file extension")
    parser.add_argument(
        "--batch-size", type=int, default=8, help="Batch size for inference"
    )
    parser.add_argument(
        "--io-workers", type=int, default=4, help="Number of IO workers"
    )
    return parser.parse_args()


class LamaInpainter:
    """LaMa inpainting model wrapper using ONNX Runtime."""

    def __init__(self, model_path: str):
        """Initialize the inpainter with ONNX model."""
        # Use GPU if available, fallback to CPU
        providers = ["CUDAExecutionProvider", "CPUExecutionProvider"]
        self.session = ort.InferenceSession(model_path, providers=providers)
        self.input_name = self.session.get_inputs()[0].name
        self.mask_name = self.session.get_inputs()[1].name
        self.output_name = self.session.get_outputs()[0].name

    def inpaint(self, image: np.ndarray, mask: np.ndarray) -> np.ndarray:
        """
        Inpaint image using the mask.

        Args:
            image: BGR image (H, W, 3) uint8
            mask: Binary mask (H, W) uint8, 255 = inpaint area

        Returns:
            Inpainted BGR image (H, W, 3) uint8
        """
        orig_h, orig_w = image.shape[:2]

        # LaMa expects 512x512 input
        img_resized = cv2.resize(image, (512, 512))
        mask_resized = cv2.resize(mask, (512, 512), interpolation=cv2.INTER_NEAREST)

        # Normalize image to [0, 1] and convert to CHW format
        img_norm = img_resized.astype(np.float32) / 255.0
        img_chw = np.transpose(img_norm, (2, 0, 1))
        img_batch = np.expand_dims(img_chw, axis=0)

        # Normalize mask to [0, 1] and add batch/channel dims
        mask_norm = (mask_resized > 127).astype(np.float32)
        mask_batch = np.expand_dims(np.expand_dims(mask_norm, axis=0), axis=0)

        # Run inference
        result = self.session.run(
            [self.output_name], {self.input_name: img_batch, self.mask_name: mask_batch}
        )[0]

        # Convert output back to image format
        result = np.squeeze(result)
        result = np.transpose(result, (1, 2, 0))
        result = np.clip(result * 255, 0, 255).astype(np.uint8)

        # Resize back to original dimensions
        result = cv2.resize(result, (orig_w, orig_h))

        return result


def load_frame(path: Path) -> Optional[np.ndarray]:
    """Load a frame from disk."""
    try:
        return cv2.imread(str(path))
    except Exception:
        return None


def save_frame(path: Path, frame: np.ndarray) -> bool:
    """Save a frame to disk."""
    try:
        cv2.imwrite(str(path), frame)
        return True
    except Exception:
        return False


def create_roi_mask(
    full_mask: np.ndarray, roi: tuple[int, int, int, int], frame_shape: tuple[int, int]
) -> np.ndarray:
    """
    Create a full-frame mask from ROI mask.

    Args:
        full_mask: The mask image for the ROI region
        roi: (x, y, width, height) of the ROI
        frame_shape: (height, width) of the full frame

    Returns:
        Full frame mask with ROI mask placed at correct position
    """
    x, y, w, h = roi
    frame_h, frame_w = frame_shape

    # Create empty mask for full frame
    result_mask = np.zeros((frame_h, frame_w), dtype=np.uint8)

    # Resize mask to ROI dimensions if needed
    if full_mask.shape[:2] != (h, w):
        full_mask = cv2.resize(full_mask, (w, h), interpolation=cv2.INTER_NEAREST)

    # Ensure mask is single channel
    if len(full_mask.shape) == 3:
        full_mask = cv2.cvtColor(full_mask, cv2.COLOR_BGR2GRAY)

    # Place mask at ROI position (clamp to frame bounds)
    x1, y1 = max(0, x), max(0, y)
    x2, y2 = min(frame_w, x + w), min(frame_h, y + h)

    mask_x1 = x1 - x
    mask_y1 = y1 - y
    mask_x2 = mask_x1 + (x2 - x1)
    mask_y2 = mask_y1 + (y2 - y1)

    result_mask[y1:y2, x1:x2] = full_mask[mask_y1:mask_y2, mask_x1:mask_x2]

    return result_mask


def main():
    """Main entry point."""
    args = parse_args()

    frames_dir = Path(args.frames)
    out_dir = Path(args.out)
    model_path = Path(args.model)
    mask_path = Path(args.mask)

    # Parse ROI
    roi = tuple(map(int, args.roi.split(",")))
    if len(roi) != 4:
        print("ERROR: ROI must be x,y,width,height", file=sys.stderr)
        sys.exit(1)

    # Validate paths
    if not frames_dir.exists():
        print(f"ERROR: Frames directory not found: {frames_dir}", file=sys.stderr)
        sys.exit(1)

    if not model_path.exists():
        print(f"ERROR: Model not found: {model_path}", file=sys.stderr)
        sys.exit(1)

    if not mask_path.exists():
        print(f"ERROR: Mask not found: {mask_path}", file=sys.stderr)
        sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)

    # Load mask
    mask_img = cv2.imread(str(mask_path), cv2.IMREAD_GRAYSCALE)
    if mask_img is None:
        print(f"ERROR: Failed to load mask: {mask_path}", file=sys.stderr)
        sys.exit(1)

    # Get list of frames
    frame_files = sorted(frames_dir.glob(f"*{args.ext}"))
    if not frame_files:
        print(f"ERROR: No frames found in {frames_dir}", file=sys.stderr)
        sys.exit(1)

    total_frames = len(frame_files)
    print(f"Found {total_frames} frames to process", file=sys.stderr)

    # Initialize model
    print("Loading LaMa model...", file=sys.stderr)
    try:
        inpainter = LamaInpainter(str(model_path))
    except Exception as e:
        print(f"ERROR: Failed to load model: {e}", file=sys.stderr)
        sys.exit(1)

    print("Model loaded, starting processing...", file=sys.stderr)

    # Process frames
    start_time = time.time()
    processed = 0

    with ThreadPoolExecutor(max_workers=args.io_workers) as io_executor:
        for frame_path in frame_files:
            # Load frame
            frame = load_frame(frame_path)
            if frame is None:
                print(f"WARNING: Failed to load {frame_path}", file=sys.stderr)
                continue

            # Create full-frame mask positioned at ROI
            frame_mask = create_roi_mask(mask_img, roi, frame.shape[:2])

            # Check if mask has any non-zero pixels
            if np.sum(frame_mask) == 0:
                # No inpainting needed, just copy the frame
                result = frame
            else:
                # Inpaint
                result = inpainter.inpaint(frame, frame_mask)

                # Blend: only replace masked areas
                mask_3ch = cv2.cvtColor(frame_mask, cv2.COLOR_GRAY2BGR) / 255.0
                result = (frame * (1 - mask_3ch) + result * mask_3ch).astype(np.uint8)

            # Save output
            out_path = out_dir / frame_path.name
            io_executor.submit(save_frame, out_path, result)

            processed += 1

            # Report progress
            elapsed = time.time() - start_time
            fps = processed / elapsed if elapsed > 0 else 0
            percent = int((processed / total_frames) * 100)
            eta_seconds = int((total_frames - processed) / fps) if fps > 0 else 0
            eta_str = f"{eta_seconds // 60:02d}:{eta_seconds % 60:02d}"

            # Output progress in format expected by main.py
            print(
                f"PROGRESS:{percent}:{processed}:{total_frames}:{fps:.1f}:{eta_str}:",
                flush=True,
            )

    total_time = time.time() - start_time
    print(
        f"Completed {processed}/{total_frames} frames in {total_time:.1f}s",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
