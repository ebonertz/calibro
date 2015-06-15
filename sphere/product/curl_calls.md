# Curl calls

# Step 1: Get Authorization token
curl https://r_IHigKd7TDtvC7nX_XDIQYB:nL9sXy3IGCB8tmn1k_oPNxTeZqH25UVw@auth.sphere.io/oauth/token -X POST -d "grant_type=client_credentials&scope=manage_project:reactionsphere-test"

# Step 2: Export the Auth token for further use
export AUTH=_Authorization Token_

# Step 3: Call the endpoint
curl https://api.sphere.io/reactionsphere-test/product-types \
\       -X POST \
\       -H "Authorization: Bearer $AUTH" \
\       -d @sphere/product/product_type-v1.json