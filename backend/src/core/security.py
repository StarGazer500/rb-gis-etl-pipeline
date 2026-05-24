# from datetime import datetime, timezone, timedelta
# from typing import Optional
# from jose import JWTError, jwt
# import bcrypt
# from fastapi import Depends, HTTPException, status, Request
# from fastapi.security import OAuth2PasswordBearer
# from sqlalchemy.ext.asyncio import AsyncSession

# from src.core.config import settings
# from src.core.database import get_session
# from src.features.accounts.repository import UserRepository
# from src.features.accounts.models import User

# # OAuth2 scheme
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """Verify a password against its hash"""
#     try:
#         return bcrypt.checkpw(
#             plain_password.encode('utf-8'), 
#             hashed_password.encode('utf-8')
#         )
#     except Exception:
#         return False

# def get_password_hash(password: str) -> str:
#     """Hash a password"""
#     salt = bcrypt.gensalt()
#     hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
#     return hashed.decode('utf-8')

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
#     """Create JWT access token"""
#     to_encode = data.copy()
    
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
#     to_encode.update({"exp": expire})
    
#     # Ensure sub is a string (JWT spec requirement)
#     if "sub" in to_encode and not isinstance(to_encode["sub"], str):
#         to_encode["sub"] = str(to_encode["sub"])
    
#     encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
#     return encoded_jwt

# async def get_current_user(
#     request: Request,
#     session: AsyncSession = Depends(get_session)
# ):
#     """Get current authenticated user from JWT token (cookie or header)"""
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
    
#     # Try to get token from cookie first
#     token = request.cookies.get("access_token")
    
#     # Fallback to Authorization header
#     if not token:
#         auth_header = request.headers.get("Authorization")
#         if auth_header and auth_header.startswith("Bearer "):
#             token = auth_header.replace("Bearer ", "")
    
#     # Remove "Bearer " prefix if it exists in cookie
#     if token and token.startswith("Bearer "):
#         token = token.replace("Bearer ", "")
    
#     if not token:
#         raise credentials_exception
    
#     try:
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
#         user_id_str: str = payload.get("sub")
        
#         if user_id_str is None:
#             raise credentials_exception
        
#         # Convert string back to int
#         user_id = int(user_id_str)
        
#     except (JWTError, ValueError) as e:
#         raise credentials_exception
    
#     repository = UserRepository(session)
#     user = await repository.get(user_id)
    
#     if user is None:
#         raise credentials_exception
    
#     return user

# async def get_current_user_optional(
#     request: Request,
#     session: AsyncSession = Depends(get_session)
# ) -> Optional[User]:
#     """Get current user if authenticated, None otherwise (doesn't raise exception)"""
#     try:
#         return await get_current_user(request, session)
#     except HTTPException:
#         return None

# def require_role(required_role: str):
#     """Dependency to require specific role"""
#     async def role_checker(current_user = Depends(get_current_user)):
#         if current_user.role != required_role:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail=f"Role {required_role} required"
#             )
#         return current_user
#     return role_checker