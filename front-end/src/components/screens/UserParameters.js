import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'

import UserPreferences from './preferences/UserPreferences';
import LinkedIn from '../common/linkedin/LinkedIn';
import LinkedInStatus from '../common/linkedin/LinkedInStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "src/components/ui/shadcn/tabs"

export default function UserParameters() {
    const log = Logger.of(UserParameters.name);

    return (
        <Tabs defaultValue='user-parameters'>
            <TabsList>
                <TabsTrigger value='user-parameters'>{t("UserParameters")}</TabsTrigger>
                <TabsTrigger value='social-networks'>{t("SocialNetworks")}</TabsTrigger>
            </TabsList>
            <TabsContent value='user-parameters'>
                <UserPreferences />
            </TabsContent>
            <TabsContent value='social-networks'>
                <LinkedIn />
                <LinkedInStatus />
            </TabsContent>
        </Tabs>
    )
}
