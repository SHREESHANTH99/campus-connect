from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.notification import NotificationType


class NotificationResponseSchema(BaseModel):
    id: UUID
    recipient_id: UUID
    type: NotificationType
    title: str
    message: str
    is_read: bool
    related_id: UUID | None
    related_type: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
