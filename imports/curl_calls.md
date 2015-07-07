# Curl calls

# Step 1: Get Authorization token
curl https://r_IHigKd7TDtvC7nX_XDIQYB:nL9sXy3IGCB8tmn1k_oPNxTeZqH25UVw@auth.sphere.io/oauth/token -X POST -d "grant_type=client_credentials&scope=manage_project:reactionsphere-test"

# Step 2: Export the Auth token for further use
export AUTH=abSISVp-86A60Nw8kN6I1Dozng5Kne4p
export PROJECT="reactionsphere-test"

# Step 3: Import Channels (for each file in channels)
cd imports/channels
for file in *.json; do
	curl https://api.sphere.io/$PROJECT/channels \
			-X POST \
			-H "Authorization: Bearer $AUTH" \
			-d @$file
done

# Step 4: Import Product Types
curl https://api.sphere.io/$PROJECT/product-types \
	    -X POST \
	    -H "Authorization: Bearer $AUTH" \
	    -d @imports/product/product_type-v1.json

