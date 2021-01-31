ARG DAGSTER_VERSION
FROM "dagster-base:${DAGSTER_VERSION}"

# ==> Dagster K8s layer
ARG DAGSTER_VERSION
RUN pip install \
      dagster-k8s==${DAGSTER_VERSION} \
# Cleanup
    && echo "==> Total size BEFORE cleanup: $(du -sh --exclude=/proc /)" \
    && echo "Removing: pip cache" && rm -rf /root/.cache  \
    && echo "Removing: pycache files" &&  find / -regex '^.*\(__pycache__\|\.py[co]\)$' -delete \
    && echo "==> Total size AFTER cleanup: $(du -sh --exclude=/proc /)"
