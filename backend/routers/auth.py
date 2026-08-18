"""Auth router — registration and login with rate limiting and password security."""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field
from utils.auth import hash_password, verify_password, create_access_token
from utils.security import rate_limit_dependency
import uuid

router = APIRouter()

# In-memory store for demo
_users: dict = {}


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    bar_number: str | None = Field(None, max_length=50)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post(
    "/register",
    response_model=TokenResponse,
    dependencies=[Depends(rate_limit_dependency(max_requests=10, window_seconds=60))]
)
async def register(req: RegisterRequest):
    if req.email in _users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    user_id = str(uuid.uuid4())
    _users[req.email] = {
        "id": user_id,
        "name": req.name,
        "email": req.email,
        "password_hash": hash_password(req.password),
        "bar_number": req.bar_number,
    }
    token = create_access_token(user_id, req.email)
    return TokenResponse(
        access_token=token,
        user={"id": user_id, "name": req.name, "email": req.email},
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    dependencies=[Depends(rate_limit_dependency(max_requests=10, window_seconds=60))]
)
async def login(req: LoginRequest):
    user = _users.get(req.email)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    token = create_access_token(user["id"], req.email)
    return TokenResponse(
        access_token=token,
        user={"id": user["id"], "name": user["name"], "email": req.email},
    )
