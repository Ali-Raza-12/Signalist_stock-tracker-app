'use server'

import { auth } from "../betterAuth/auth"
import { inngest } from "../inngest/ai"

export const signUpWithEmail = async({ email, password, fullName}) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullname }})

        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry}
            })
        }

        return { success: true, data: response }
    } catch (error) {
        console.log('Sign up failed', error)
        return { success: false, error: 'Sign up failed'}
    }
}