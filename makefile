deploy-app:
	cd skeleton-app && npm run build
	firebase deploy --only hosting

deploy-functions-api:
	firebase deploy --only functions:api

deploy:
	make deploy-functions-api
	make deploy-app
