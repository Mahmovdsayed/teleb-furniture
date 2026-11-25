'use client';

import { Field, FieldGroup } from "@teleb/ui/components/field";
import { MessaeginitialState } from "@/constant/initial-values";
import { ConfettiFireworks } from "@teleb/utils/confetti-fireworks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { sendMessage } from "@/services/contact";
import { useLocale, useTranslations } from "next-intl";
import FormField from "@teleb/ui/components/form-field";
import FormTextarea from "@teleb/ui/components/form-textarea";
import { Button } from "@teleb/ui/components/button";
import { Send } from "lucide-react";
import { Spinner } from "@teleb/ui/components/spinner";
import { CreateMessageInput, createMessageSchema } from "@teleb/validations/message";

const ContactUsForm = () => {
    const t = useTranslations("contact");
    const locale = useLocale();

    const { register, onSubmit, loading, reset, formState: { errors, isValid } } = useFormHandler<CreateMessageInput>({
        schema: createMessageSchema,
        defaultValues: MessaeginitialState,
        service: (data: CreateMessageInput) => sendMessage(data, locale),
        onSuccess: () => {
            reset();
            ConfettiFireworks();
        }
    })

    return <>
        <form onSubmit={onSubmit}>
            <FieldGroup>
                <FormField
                    type="text"
                    name="fullName"
                    register={register}
                    error={errors.fullName}
                    label={t("name")}
                    placeholder={t('namePlaceholder')}
                    description={t("nameDescription")}
                    disabled={loading}
                />
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        type="text"
                        name="email"
                        register={register}
                        error={errors.email}
                        label={t("email")}
                        placeholder={t('emailPlaceholder')}
                        description={t("emailDescription")}
                        disabled={loading}
                    />
                    <FormField
                        type="tel"
                        name="phone"
                        register={register}
                        error={errors.phone}
                        label={t("phone")}
                        placeholder={t('phonePlaceholder')}
                        description={t("phoneDescription")}
                        disabled={loading}
                    />
                </div>
                <FormField
                    type="text"
                    name="subject"
                    register={register}
                    error={errors.subject}
                    label={t("subject")}
                    placeholder={t('subjectPlaceholder')}
                    description={t("subjectDescription")}
                    disabled={loading}
                />
                <FormTextarea
                    name="message"
                    register={register}
                    error={errors.message}
                    label={t("message")}
                    placeholder={t('messagePlaceholder')}
                    description={t("messageDescription")}
                    disabled={loading}
                />
                <Field>
                    <Button
                        disabled={loading || !isValid}
                        type="submit"
                        size={"lg"}
                        className={"rounded-2xl"}
                    >
                        {loading ? <Spinner /> : <Send />}
                        {t("send")}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    </>;
};

export default ContactUsForm;