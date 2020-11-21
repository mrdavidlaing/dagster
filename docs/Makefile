.PHONY: update_version
build:
	cd sphinx; make clean; make json; python pack_json.py

update_version:
	echo "Saving version $(version)"
	python update_version.py --version $(version)