"""Standard Python logging setup for PUSHPAK API."""

import logging
import sys


def setup_logging(debug: bool = False) -> logging.Logger:
    """Configure and return root logger using standard library logging."""
    log_level = logging.DEBUG if debug else logging.INFO

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    logger = logging.getLogger("pushpak")
    logger.setLevel(log_level)
    return logger
