/**
 * Resolves EmailJS credentials from Vite env vars first, then contact.json settings.
 */
export function getEmailJsConfig(settings = {}) {
    const fromEnv = (key) => {
        const value = import.meta.env[key]
        return typeof value === "string" && value.trim().length > 0 ?
            value.trim() :
            null
    }

    const fromSettings = (value) => {
        return typeof value === "string" && value.trim().length > 0 ?
            value.trim() :
            null
    }

    const publicKey = fromEnv("VITE_EMAILJS_PUBLIC_KEY") || fromSettings(settings.emailJsPublicKey)
    const serviceId = fromEnv("VITE_EMAILJS_SERVICE_ID") || fromSettings(settings.emailJsServiceId)
    const templateId = fromEnv("VITE_EMAILJS_TEMPLATE_ID") || fromSettings(settings.emailJsTemplateId)

    return {
        publicKey,
        serviceId,
        templateId,
        isConfigured: Boolean(publicKey && serviceId && templateId),
    }
}
