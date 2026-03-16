from django.db import models
from django.core.validators import RegexValidator, MinValueValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
import uuid


class Customer(models.Model):
    """
    Represents a water utility customer.
    
    This model stores customer information including account details,
    contact information, and meter registration.
    """
    
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Account Information
    account_number = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        help_text=_("Unique water utility account number"),
        validators=[
            RegexValidator(
                regex=r'^[A-Z0-9\-]+$',
                message=_("Account number can only contain letters, numbers, and hyphens"),
                code='invalid_account_number',
            ),
        ]
    )
    
    meter_number = models.CharField(
        max_length=20,
        unique=True,
        help_text=_("Water meter identification number")
    )
    
    # Personal Information
    name = models.CharField(
        max_length=255,
        help_text=_("Customer's full name")
    )
    
    phone = models.CharField(
        max_length=20,
        help_text=_("Customer's primary contact phone number"),
        validators=[
            RegexValidator(
                regex=r'^\+?[\d\s\-\(\)]{10,}$',
                message=_("Enter a valid phone number"),
                code='invalid_phone',
            ),
        ]
    )
    
    email = models.EmailField(
        null=True,
        blank=True,
        help_text=_("Customer's email address")
    )
    
    address = models.TextField(
        help_text=_("Customer's physical address")
    )
    
    # Account Status
    class StatusChoices(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        SUSPENDED = 'suspended', _('Suspended')
        CLOSED = 'closed', _('Closed')
    
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE,
        db_index=True,
        help_text=_("Current account status")
    )
    
    # Metadata
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("Account creation timestamp")
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text=_("Last account update timestamp")
    )
    
    class Meta:
        db_table = 'accounts_customer'
        verbose_name = _('Customer')
        verbose_name_plural = _('Customers')
        indexes = [
            models.Index(fields=['account_number']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['account_number', 'status']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.account_number})"
    
    def __repr__(self):
        return f"<Customer: {self.account_number}>"
    
    def get_active_bill(self):
        """Get the current active billing record for this customer."""
        from billing.models import BillingRecord
        return BillingRecord.objects.filter(
            customer=self,
            status=BillingRecord.StatusChoices.PENDING
        ).first()
    
    def get_total_outstanding(self):
        """Calculate total outstanding balance for the customer."""
        from billing.models import BillingRecord
        return BillingRecord.objects.filter(
            customer=self,
            status=BillingRecord.StatusChoices.PENDING
        ).aggregate(
            total=models.Sum('amount_due')
        )['total'] or 0
    
    def is_active(self):
        """Check if the customer account is active."""
        return self.status == self.StatusChoices.ACTIVE
    
    def suspend_account(self, reason=""):
        """Suspend the customer account."""
        self.status = self.StatusChoices.SUSPENDED
        self.save(update_fields=['status', 'updated_at'])


class User(models.Model):
    """
    Represents system users (admin, operators, support staff).
    
    This model extends Django's default User model for application-specific needs.
    """
    
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Credentials
    username = models.CharField(
        max_length=150,
        unique=True,
        db_index=True,
        help_text=_("Unique username for login")
    )
    
    email = models.EmailField(
        unique=True,
        db_index=True,
        help_text=_("User's email address")
    )
    
    password_hash = models.CharField(
        max_length=255,
        help_text=_("Hashed password (Django handles hashing)")
    )
    
    # User Information
    first_name = models.CharField(
        max_length=150,
        blank=True,
        help_text=_("User's first name")
    )
    
    last_name = models.CharField(
        max_length=150,
        blank=True,
        help_text=_("User's last name")
    )
    
    # Role & Permissions
    class RoleChoices(models.TextChoices):
        ADMIN = 'admin', _('Administrator')
        OPERATOR = 'operator', _('Operator')
        SUPPORT = 'support', _('Support Staff')
        AUDITOR = 'auditor', _('Auditor')
        VIEWER = 'viewer', _('Viewer')
    
    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.VIEWER,
        db_index=True,
        help_text=_("User's role in the system")
    )
    
    # Account Status
    class StatusChoices(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        LOCKED = 'locked', _('Locked')
        DELETED = 'deleted', _('Deleted')
    
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE,
        help_text=_("Current user account status")
    )
    
    # Activity Tracking
    last_login = models.DateTimeField(
        null=True,
        blank=True,
        help_text=_("Last login timestamp")
    )
    
    last_activity = models.DateTimeField(
        auto_now=True,
        help_text=_("Last activity timestamp")
    )
    
    # Metadata
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("User creation timestamp")
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text=_("Last user update timestamp")
    )
    
    # Additional Fields
    is_staff = models.BooleanField(
        default=False,
        help_text=_("Designates whether the user can access the admin site")
    )
    
    is_superuser = models.BooleanField(
        default=False,
        help_text=_("Designates whether the user has all permissions")
    )
    
    class Meta:
        db_table = 'accounts_user'
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name() or self.username}"
    
    def __repr__(self):
        return f"<User: {self.username}>"
    
    def get_full_name(self):
        """Return the user's full name."""
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name or self.username
    
    def get_short_name(self):
        """Return the user's short name."""
        return self.first_name or self.username
    
    def is_active_user(self):
        """Check if the user account is active."""
        return self.status == self.StatusChoices.ACTIVE
    
    def is_admin(self):
        """Check if the user has admin role."""
        return self.role == self.RoleChoices.ADMIN or self.is_superuser
    
    def can_view_audit_logs(self):
        """Check if user can view audit logs."""
        return self.role in [self.RoleChoices.ADMIN, self.RoleChoices.AUDITOR]
    
    def deactivate(self):
        """Deactivate the user account."""
        self.status = self.StatusChoices.INACTIVE
        self.save(update_fields=['status', 'updated_at'])
    
    def lock(self):
        """Lock the user account."""
        self.status = self.StatusChoices.LOCKED
        self.save(update_fields=['status', 'updated_at'])
    
    def update_last_login(self):
        """Update the last login timestamp."""
        self.last_login = timezone.now()
        self.save(update_fields=['last_login', 'updated_at'])
