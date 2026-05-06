import logging
import json
from datetime import datetime, timezone

class JSONFormatter(logging.Formatter):
    """Formats logs as JSON — easy to parse in prod (ELK, Datadog etc)"""
    def format(self, record: logging.LogRecord) -> str:
        log = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
        }
        # Attach extra fields if passed
        if hasattr(record, "user_id"):
            log["user_id"] = record.user_id
        if hasattr(record, "path"):
            log["path"] = record.path
        # Never log passwords — safety check
        if "password" in log.get("message", "").lower():
            log["message"] = "[REDACTED]"
        return json.dumps(log)


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()           # logs to terminal
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger