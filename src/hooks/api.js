/**
 * @author Nasir Khan
 * @description This hook provides methods to interact with external APIs.
 */

import emailjs from "@emailjs/browser"
import {useConstants} from "/src/hooks/constants.js"
import {useUtils} from "/src/hooks/utils.js"

const constants = useConstants()
const utils = useUtils()

export const useApi = () => {
    return {
        validators,
        handlers,
        analytics
    }
}

const validators = {
    validateEmailRequest: (name, email, subject, message) => {
        const minWordCountForMessage = 3

        const validations = [
            { errorCode: constants.ErrorCodes.VALIDATION_EMPTY_FIELDS, errorCondition: !name || !email || !subject || !message },
            { errorCode: constants.ErrorCodes.VALIDATION_EMAIL, errorCondition: !utils.validation.validateEmail(email) },
            { errorCode: constants.ErrorCodes.VALIDATION_MESSAGE_LENGTH, errorCondition: !utils.validation.isLongerThan(message, minWordCountForMessage), messageParameter: minWordCountForMessage + 1 },
            { errorCode: constants.ErrorCodes.VALIDATION_MESSAGE_SPAM, errorCondition: utils.validation.isSpam(message) },
        ]

        const error = validations.find(v => v.errorCondition)

        return {
            success: !error,
            errorCode: error?.errorCode,
            errorParameter: error?.messageParameter,

            bundle: {
                name,
                from_name: name,
                email,
                from_email: email,
                reply_to: email,
                subject,
                custom_subject: subject,
                message,
                time: new Date().toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                }),
                custom_source: utils.url.getAbsoluteLocation(),
                custom_source_name: "Nasir Khan Portfolio"
            }
        }
    }
}

const handlers = {
    /**
     * @return {Promise<{success: (*|boolean)}>}
     */
    dummyRequest: async () => {
        await new Promise((resolve) => setTimeout(resolve, 700))
        window._dummyRequestSuccess = !window._dummyRequestSuccess

        return {
            success: window._dummyRequestSuccess
        }
    },

    /**
     * @param {Object} validationBundle
     * @param {String} publicKey
     * @param {String} serviceId
     * @param {String} templateId
     * @return {Promise<{success: boolean}>}
     */
    sendEmailRequest: async (validationBundle, publicKey, serviceId, templateId) => {
        emailjs.init(publicKey)

        const response = {success: false}

        try {
            const result = await emailjs.send(serviceId, templateId, validationBundle)
            response.success = result.status === 200
        } catch (error) {
            if(import.meta.env.DEV) {
                console.error("[EmailJS] Failed to send message:", error)
            }
            response.success = false
        }

        return response
    }
}

const analytics = {
    reportVisit: async () => {
        try {

            const visitData = {
                url: window.location.href,
                time: new Date().toISOString(),
                userAgent: navigator.userAgent
            }

            console.log("📊 Portfolio Visit Tracked", visitData)

            const existing = JSON.parse(localStorage.getItem("portfolio_visits") || "[]")
            existing.push(visitData)
            localStorage.setItem("portfolio_visits", JSON.stringify(existing))

        } catch (error) {
            console.error("Analytics error:", error)
        }
    }
}