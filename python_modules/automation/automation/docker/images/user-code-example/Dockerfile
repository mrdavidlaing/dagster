ARG BASE_IMAGE
FROM "${BASE_IMAGE}"

ARG DAGSTER_VERSION

# ==> Dagster base layer
RUN echo "==> Add Dagster K8s layer" \
    # Cron - remove along with dagster-cron once daemon scheduler is default
    && apt-get update -yqq \
    && apt-get install -yqq --no-install-recommends cron \
    # Dagster
    && pip install \
        dagster==${DAGSTER_VERSION} \
        dagster-graphql==${DAGSTER_VERSION} \
        dagster-postgres==${DAGSTER_VERSION} \
        dagster-cron==${DAGSTER_VERSION} \
    # Cleanup
    && echo "==> Total size BEFORE cleanup: $(du -sh --exclude=/proc /)" \
    && echo "Removing: apt caches" && rm -rf /var/lib/apt/lists/* \
    && echo "Removing: pip cache" && rm -rf /root/.cache  \
    && echo "Removing: pycache files" &&  find / -regex '^.*\(__pycache__\|\.py[co]\)$' -delete \
    && echo "==> Total size AFTER cleanup: $(du -sh --exclude=/proc /)"

# ==> Dagster K8s layer
ARG DAGSTER_VERSION
RUN echo "==> Add Dagster K8s layer" \
    && pip install \
          dagster-aws==${DAGSTER_VERSION} \
#          dagster-gcp==${DAGSTER_VERSION} \
#          dagster-azure==${DAGSTER_VERSION} \
          dagster-k8s==${DAGSTER_VERSION} \
          dagster-celery-k8s==${DAGSTER_VERSION} \
          dagster-celery[flower,redis,kubernetes]==${DAGSTER_VERSION} \
    # Cleanup
    && echo "==> Total size BEFORE cleanup: $(du -sh --exclude=/proc /)" \
    && echo "Removing: pip cache" && rm -rf /root/.cache  \
    && echo "Removing: pycache files" &&  find / -regex '^.*\(__pycache__\|\.py[co]\)$' -delete \
    # Only keep common AWS APIs (not 100% confident all these are needed)
    && echo "Removing: Unused boto schema files" && find /usr/local/lib/python3.7/site-packages/botocore/data -mindepth 1 -maxdepth 1 -type d ! -regex '.*\(s3\|ec2\|rds\|cloudfront\|iam\|elb\|schemas\|sso\|service\|route53\|cloud\|resource\|config\|events\|sns\|sqs\|ssm\|secrets\|logs\|kms\)+.*' -exec rm -r {} + \
    && echo "==> Total size AFTER cleanup: $(du -sh --exclude=/proc /)"

# ==> Add user code layer
COPY build_cache/requirements.txt /
RUN echo "==> Add user code dependancies - in a separate layer to speed up future builds" \
    && pip install -r /requirements.txt \
    # Cleanup
    && echo "==> Total size BEFORE cleanup: $(du -sh --exclude=/proc /)" \
    && echo "Removing: pip cache" && rm -rf /root/.cache  \
    && echo "Removing: pycache files" &&  find / -regex '^.*\(__pycache__\|\.py[co]\)$' -delete \
    && echo "==> Total size AFTER cleanup: $(du -sh --exclude=/proc /)"

# ==> User code layer
COPY build_cache/ /
