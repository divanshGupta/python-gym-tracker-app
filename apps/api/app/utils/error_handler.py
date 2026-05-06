from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

def register_error_handlers(app: FastAPI):

    # Pydantic validation errors (wrong request body shape)
    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(request: Request, exc: RequestValidationError):
        errors = []
        for err in exc.errors():
            errors.append({
                "field": " -> ".join(str(x) for x in err["loc"]),
                "message": err["msg"]
            })
        return JSONResponse(status_code=422, content={"success": False, "errors": errors})

    # Generic unhandled exceptions
    @app.exception_handler(Exception)
    async def generic_error_handler(request: Request, exc: Exception):
        return JSONResponse(status_code=500, content={"success": False, "error": "Internal server error"})