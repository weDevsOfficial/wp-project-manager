<template>
    <div class="cpm-create-user-form-wrap">

        <div class="cpm-error"></div>

        <form action="" class="cpm-user-create-form">
            <div class="cpm-field-wrap">
                <label>Username</label>
                <input type="text" required name="user_name">

            </div>
            <div class="cpm-field-wrap">
                <label>First Name</label>
                <input type="text" name="first_name">

            </div>
            <div class="cpm-field-wrap">
                <label>Last Name</label>
                <input type="text" name="last_name">

            </div>
            <div class="cpm-field-wrap">
                <label>Email</label>
                <input type="email" required name="user_email">

            </div>
            <div>
                <input class="button-primary" type="submit" value="Create User" name="create_user">
                <span></span>
            </div>
        </form>
    </div>
</template>