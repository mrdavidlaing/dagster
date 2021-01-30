ARG BASE_IMAGE
FROM "${BASE_IMAGE}"

ARG DAGSTER_VERSION

# ==> Dagster base layer
RUN \
# Cron - remove along with dagster-cron once daemon scheduler is default
       apt-get update -yqq \
    && apt-get install -yqq --no-install-recommends cron \
# Dagster
    && pip install \
        dagster==${DAGSTER_VERSION} \
        dagster-graphql==${DAGSTER_VERSION} \
        dagster-postgres==${DAGSTER_VERSION} \
        dagster-aws==${DAGSTER_VERSION} \
        dagster-cron==${DAGSTER_VERSION} \
# Cleanup
    &&  rm -rf /var \
    &&  rm -rf /root/.cache  \
    &&  rm -rf /usr/lib/python2.7 \
    &&  rm -rf /usr/lib/x86_64-linux-gnu/guile
