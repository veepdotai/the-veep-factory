#!/bin/sh

VERSION=$(grep "Version:\s*\d*\.\d*\.\d*" veepdotai.php | cut -b 23-40)

echo zip -r veepdotai-$VERSION.zip veepdotai -x \*/.git/\* -x \*/test/\* -x \*/tests/\*
cd .. && {
	zip -r veepdotai-$VERSION.zip veepdotai -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
} && {
	mv veepdotai-$VERSION.zip veepdotai/dist
	cp veepdotai/dist/veepdotai-$VERSION.zip veepdotai/dist/veepdotai.zip
} && cd veepdotai 

cd .. && {
	zip -r veepdotai_login_to_headless_wp.zip veepdotai_login_to_headless_wp -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r veepdotai_rest.zip veepdotai_rest -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r veepdotai_extractors.zip veepdotai_extractors -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r veepdotai_dsl.zip veepdotai_dsl -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r veepdotai_billing.zip veepdotai_billing -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r veepdotai_setup.zip veepdotai_setup -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r veepdotai_misc.zip veepdotai_misc -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r veepdotai_front_js.zip veepdotai_front_js -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r login-with-google.zip login-with-google -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 
	zip -r wp-graphql-meta-query.zip wp-graphql-meta-query -x \*/.git/\* -x \*/dist/\* -x \*/test/\* -x \*/tests/\* 


} && {
	mv veepdotai_login_to_headless_wp.zip veepdotai/dist
	mv veepdotai_rest.zip veepdotai/dist
	mv veepdotai_extractors.zip veepdotai/dist
	mv veepdotai_dsl.zip veepdotai/dist
	mv veepdotai_setup.zip veepdotai/dist
	mv veepdotai_misc.zip veepdotai/dist
	mv veepdotai_billing.zip veepdotai/dist
	mv veepdotai_front_js.zip veepdotai/dist
	mv login-with-google.zip veepdotai/dist
	mv wp-graphql-meta-query.zip veepdotai/dist

} && cd veepdotai 

