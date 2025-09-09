'use client'

import LinkedInOps from 'src/components/common/linkedin/LinkedInOps';

export default function LinkedIn() {
  let access_token = "AQWGiJvdcW0bIHTaeq8pAgxPoEkFFOuGGkMgVmzVLQ38bVHY0_-HJp3vPpJl9fc2pspfxnHTIGe_RVgkxj5Jozre8P4g_ejI3BEdMohGsZ86SimINhfSDvBeL8UHfN-yEI4UJnn4ayMGePMgO3y_IDCOz3I6cvt2kmnCqH0JybtwrDxEzjT-5eMEVilIWY00mZDdnwwbMVAQtCb2qzKZ50CS86rX3Ph7Pk7VjB5-Bt2U1z9FrfuW5WVdBAcYEwQlwSBbI0S3QXjSQvgwv8XbHZ3dJIIxB8hDPKSWDuW1nukEP-_kW6vC5FQuZiC24l6h9IyGH6A4vRAIRBrGgZn12UzwiFNdAw"

  
  return (
    <>
      <LinkedInOps accessToken={access_token} content={"Ceci est un test."} />
    </>
  )

}
