ARG BASE_IMAGE
FROM "${BASE_IMAGE}"

ARG DAGSTER_VERSION

# ==> Dagster K8s base layer - generates a common layer that is shared across other images
RUN echo "==> Adding Dagster K8s base layer" \
    && pip install --no-cache-dir \
        # Core
        dagster==${DAGSTER_VERSION} \
        dagster-graphql==${DAGSTER_VERSION} \
        dagster-postgres==${DAGSTER_VERSION} \
        # Cloud
        dagster-aws==${DAGSTER_VERSION} \
        dagster-azure==${DAGSTER_VERSION} \
        dagster-gcp==${DAGSTER_VERSION} \
        # K8s
        dagster-k8s==${DAGSTER_VERSION} \
    # Cleanup
    && echo "==> Total size BEFORE cleanup: $(du -sh --exclude=/proc /)" \
    && echo "Removing: pycache files" &&  find / -regex '^.*\(__pycache__\|\.py[co]\)$' -delete \
    # Experimental: Only keep common AWS API boto schema files (a slightly risky way to save 32MB from the final image)
    #&& echo "Removing: Unused boto schema files" && find /usr/local/lib/python3.7/site-packages/botocore/data -mindepth 1 -maxdepth 1 -type d ! -regex '.*\(s3\|ec2\|rds\|cloudfront\|iam\|elb\|schemas\|sso\|service\|route53\|cloud\|resource\|config\|events\|sns\|sqs\|ssm\|secrets\|logs\|kms\)+.*' -exec rm -r {} + \
    && echo "==> Total size AFTER cleanup: $(du -sh --exclude=/proc /)"

# ==> Dagster Celery layer
RUN echo "==> Adding Dagster Celery layer" \
    && pip install --no-cache-dir \
        # Celery
        dagster-celery-k8s==${DAGSTER_VERSION} \
        dagster-celery[flower,redis,kubernetes]==${DAGSTER_VERSION} \
    # Cleanup
    && echo "==> Total size BEFORE cleanup: $(du -sh --exclude=/proc /)" \
    && echo "Removing: pycache files" &&  find / -regex '^.*\(__pycache__\|\.py[co]\)$' -delete \
    && echo "==> Total size AFTER cleanup: $(du -sh --exclude=/proc /)"

# ==> Dagit layer
RUN echo "==> Adding Dagit layer" \
    && pip install --no-cache-dir \
        # Dagit
        dagit==${DAGSTER_VERSION} \
    # Cleanup
    && echo "==> Total size BEFORE cleanup: $(du -sh --exclude=/proc /)" \
    && echo "Removing: pycache files" &&  find / -regex '^.*\(__pycache__\|\.py[co]\)$' -delete \
    && echo "==> Total size AFTER cleanup: $(du -sh --exclude=/proc /)"

# ==> Add user code dependancies in a separate layer to speed up future builds
COPY example_project/requirements.txt /
RUN echo "==> Adding user code dependancies" \
    && pip install --no-cache-dir -r /requirements.txt \
    # Cleanup
    && echo "==> Total size BEFORE cleanup: $(du -sh --exclude=/proc /)" \
    && echo "Removing: pycache files" &&  find / -regex '^.*\(__pycache__\|\.py[co]\)$' -delete \
    && echo "==> Total size AFTER cleanup: $(du -sh --exclude=/proc /)"

# ==> User code layer
COPY example_project/ /
WORKDIR /example_project
