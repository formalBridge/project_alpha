import { Form, useActionData } from "@remix-run/react";

import { insertAction } from "app/features/post_mokjak/action";

import styles from "./create.module.scss";

export default function Create(){
    const actionData = useActionData<typeof insertAction>();

    return (
        <div className={styles.root}>
            <h1>Post Create</h1>
            {actionData && <p>{actionData.error[0].message}</p>}
            <Form method="post" className={styles.formContainer}>
                <input type="text" name="title" placeholder="Title"/>
                <textarea name="content" placeholder="Content"/>
                <button type="submit">Submit</button>
            </Form>
        </div>
    );
}
