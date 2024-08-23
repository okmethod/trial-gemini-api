deploy-app:
	cd skeleton-app && npm run build
	firebase deploy --only hosting

deploy-function:
	firebase deploy --only functions

deploy:
	deploy-functions
	deploy-hosting
