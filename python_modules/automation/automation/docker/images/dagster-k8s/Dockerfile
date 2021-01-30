ARG DAGSTER_VERSION
FROM "dagster-base:${DAGSTER_VERSION}"

# ==> Dagster K8s layer
ARG DAGSTER_VERSION
RUN pip install \
      dagster-k8s==${DAGSTER_VERSION} \
# Cleanup
    &&  rm -rf /var \
    &&  rm -rf /root/.cache  \
    &&  rm -rf /usr/lib/python2.7 \
    &&  rm -rf /usr/lib/x86_64-linux-gnu/guile
