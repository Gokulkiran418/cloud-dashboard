"""Initial resource and recommendation tables

Revision ID: 333329599b64
Revises: 
Create Date: 2025-07-27 22:42:27.874456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = '333329599b64'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('resource',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('type', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('provider', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('instance_type', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    sa.Column('size', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    sa.Column('cpu_utilization', sa.Float(), nullable=True),
    sa.Column('memory_utilization', sa.Float(), nullable=True),
    sa.Column('storage_gb', sa.Integer(), nullable=True),
    sa.Column('monthly_cost', sa.Float(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recommendation',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('resource_id', sa.Integer(), nullable=False),
    sa.Column('recommendation_type', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('current_config', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('suggested_config', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('potential_saving', sa.Float(), nullable=False),
    sa.Column('confidence', sa.Float(), nullable=False),
    sa.Column('reason', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('implemented', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('implemented_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['resource_id'], ['resource.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('recommendation')
    op.drop_table('resource')
    # ### end Alembic commands ###
