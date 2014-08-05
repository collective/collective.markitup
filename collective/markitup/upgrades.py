from plone.app.upgrade.utils import loadMigrationProfile


def upgrade_to_1001(context):
    """ reinstall
    """
    # Reinstall
    loadMigrationProfile(
        context,
        'profile-collective.markitup:default'
    )
