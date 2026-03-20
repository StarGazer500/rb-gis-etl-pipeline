from src.core.celery import celery_app


@celery_app.task(bind=True, name="drone_image_tiling_task")
def drone_image_tiling_task(self, *args, **kwargs):
    # TODO: implement drone image tiling logic
    pass
