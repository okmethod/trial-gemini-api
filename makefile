deploy-app:
	cd skeleton-app && npm run build
	firebase deploy --only hosting

deploy-functions:
	firebase deploy --only functions

deploy:
	make deploy-functions
	make deploy-app
