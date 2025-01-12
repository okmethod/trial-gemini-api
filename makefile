deploy-app:
	cd skeleton-app && npm run build
	firebase deploy --only hosting

deploy-functions-api:
	firebase deploy --only functions

deploy:
	make deploy-functions-api
	make deploy-app
