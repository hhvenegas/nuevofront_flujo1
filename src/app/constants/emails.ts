import { Email } from './email';

export const EMAILS: Email[] = [
    {
        policy_id: "1990",
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: "paulina.guerrero@populusfintech.com",
                            name: "Paulina Guerrero"
                        }
                    ],
                    dynamic_template_data: {
                        car:  "carro",
                        name: "Paulina"
                    }
                }
            ],
            from: {
                email: "no_reply@sxkm.mx",
                name: "SEGURO X KILOMETRO"
            },
            template_id: "d-cbc7013facd4478db3f483336c136f22"
        }
    }
]