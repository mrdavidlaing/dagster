from dagster import check
from dagster.core.definitions.job import JobType
from dagster.core.host_representation import ExternalSchedule, ExternalSensor, JobSelector
from dagster.core.scheduler.job import JobStatus

from .utils import UserFacingGraphQLError, capture_error


@capture_error
def get_unloadable_job_states_or_error(graphene_info, job_type=None):
    from ..schema.jobs import GrapheneJobState, GrapheneJobStates

    check.opt_inst_param(job_type, "job_type", JobType)
    job_states = graphene_info.context.instance.all_stored_job_state(job_type=job_type)
    external_jobs = [
        job
        for repository_location in graphene_info.context.repository_locations
        for repository in repository_location.get_repositories().values()
        for job in repository.get_external_schedules() + repository.get_external_sensors()
    ]

    job_origin_ids = {job.get_external_origin_id() for job in external_jobs}

    unloadable_states = [
        job_state
        for job_state in job_states
        if job_state.job_origin_id not in job_origin_ids and job_state.status == JobStatus.RUNNING
    ]

    return GrapheneJobStates(
        results=[GrapheneJobState(job_state=job_state) for job_state in unloadable_states]
    )


@capture_error
def get_job_state_or_error(graphene_info, selector):
    from ..schema.errors import GrapheneJobNotFoundError
    from ..schema.jobs import GrapheneJobState

    check.inst_param(selector, "selector", JobSelector)
    location = graphene_info.context.get_repository_location(selector.location_name)
    repository = location.get_repository(selector.repository_name)
    external_job = repository.get_external_job(selector.job_name)
    if not external_job or not isinstance(external_job, (ExternalSensor, ExternalSchedule)):
        raise UserFacingGraphQLError(GrapheneJobNotFoundError(selector.job_name))

    job_state = graphene_info.context.instance.get_job_state(external_job.get_external_origin_id())
    if not job_state:
        job_state = external_job.get_default_job_state(graphene_info.context.instance)
    return GrapheneJobState(job_state=job_state)
