ARG BASE_IMAGE
FROM "${BASE_IMAGE}"

ARG DAGSTER_VERSION

# remove once daemon scheduler is default
RUN apt-get update -yqq && \
    apt-get install -yqq --no-install-recommends cron

# ==> Dagster K8s layer
RUN pip install \
        dagster==${DAGSTER_VERSION} \
        dagster-azure==${DAGSTER_VERSION} \
        dagster-postgres==${DAGSTER_VERSION} \
        dagster-cron==${DAGSTER_VERSION} \
        dagster-k8s==${DAGSTER_VERSION} \
        dagster-aws==${DAGSTER_VERSION} \
        dagster-gcp==${DAGSTER_VERSION} \
        dagster-graphql==${DAGSTER_VERSION} \
        dagit==${DAGSTER_VERSION}
# Cleanup
    &&  rm -rf /var \
    &&  rm -rf /root/.cache  \
    &&  rm -rf /usr/lib/python2.7 \
    &&  rm -rf /usr/lib/x86_64-linux-gnu/guile
