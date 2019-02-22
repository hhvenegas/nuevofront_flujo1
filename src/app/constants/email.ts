export class Email {
    policy_id:string;
    body: {
        personalizations: [{
            to: [{
                email: string,
                name: string
            }],
            dynamic_template_data: {
                car:  string,
                name: string
            }
        }],
        from: {
            email: string,
            name: string
        },
        template_id: string
    }    
}