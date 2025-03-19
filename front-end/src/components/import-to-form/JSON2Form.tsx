import { t } from 'i18next'

import { cn } from "@/components/ui/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function JSON2Form() {

    let cn4Label = "align-top w-[150px] mt-4 mb-3 font-semibold"
    let cn4RadioItem = "flex items-center space-x-2"
    let cn4RadioItemLabel = ""
    let cn4Textarea = "mb-2 border-1"
    let cn4Input = "mb-2 border-1"

    return (
        <div className="">
            <fieldset>
                <Label className={cn4Label} htmlFor='importFormJson' id='jsonLabel'>{t("JsonToImport")}</Label>
                <Textarea className={cn4Textarea} id="importFormJson" name="json" placeholder={t("PasteJson")} />
            </fieldset>
            <fieldset>
                <Label className={cn4Label} htmlFor='importFormFieldsList' id='fieldsLabel'>{t("FieldsToImport")}</Label>
                <Input className={cn4Input} id="importFormFieldsList" name="fields" placeholder={t('EnterFieldsWithCommas')} />
            </fieldset>
            <fieldset>
                <Label className={cn4Label} id='importFormStrategyLabel'>{t("Strategy")}</Label>
                <input type="hidden" id="importFormStrategy" />
                <RadioGroup onValueChange={(value) => document.getElementById('importFormStrategy').value = value} defaultValue="merge-after">
                    <div className={cn4RadioItem}>
                        <RadioGroupItem value="replace" />
                        <Label className={cn4RadioItemLabel}>{t("Replace")}</Label>
                    </div>
                    <div className={cn4RadioItem}>
                        <RadioGroupItem value="merge-before" />
                        <Label className={cn4RadioItemLabel}>{t("MergeBefore")}</Label>
                    </div>
                    <div className={cn4RadioItem}>
                        <RadioGroupItem value="merge-after" />
                        <Label className={cn4RadioItemLabel}>{t("MergeAfter")}</Label>
                    </div>
                </RadioGroup>
            </fieldset>
        </div>
    )
}