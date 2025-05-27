<script lang="ts">
    import { Input, Button } from '$lib/components';
    import { goto } from '$app/navigation';
    import { toastNotify } from '$lib';
    import { enhance } from '$app/forms';

    export let form;

    const buttonFontSize = "1.5rem";
    const buttonPadding = "1.4rem 0";

    let email = '';
    let password = '';
    let frontendErrorShown = false;

    function handleFrontendValidation(event: Event) {
      if (!email.trim() || !password.trim()) {
        event.preventDefault();
        toastNotify('Todos los campos son obligatorios', 'error');
        frontendErrorShown = true;
        return;
      } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        event.preventDefault();
        toastNotify('El correo no es válido', 'error');
        frontendErrorShown = true;
        return;
      }
      frontendErrorShown = false;
    }

    $: if (form?.error && !frontendErrorShown) {
      toastNotify('Correo o contraseña incorrectos', 'error');
    }
    $: if (form?.success) {
      toastNotify('Inicio de sesión exitoso', 'success');
      goto('/');
    }
</script>

<div class="login-bg">
    <form class="login-form" method="POST" use:enhance on:submit={handleFrontendValidation}>
        <h1>Iniciar Sesión</h1>

        <div class="field-group">
            <label for="email">Email</label>
            <Input id="email" name="email" type="email" placeholder="Introduce tu email" bind:value={email} />
        </div>

        <div class="field-group">
            <label for="password">Contraseña</label>
            <Input id="password" name="password" type="password" placeholder="Introduce tu contraseña" bind:value={password} />
        </div>

        <div class="button-group">
            <Button type="submit" text="Iniciar sesión" variant="secondary" fontSize={buttonFontSize} padding={buttonPadding} />
        </div>

        <p class="center-text login-link">
            <a href="/register" class="discreet-link">¿No tienes cuenta? Regístrate aquí</a>
        </p>
    </form>
</div>

<style>
.login-bg {
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-form {
    background: var(--darkPrimary);
    border-radius: var(--borderRadius);
    padding: 5rem 4rem 4rem 4rem;
    max-width: 60rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 0;
}

h1 {
    text-align: center;
    margin-bottom: 5rem;
    font-size: 3.4rem;
    font-weight: 600;
}

label {
    font-size: 1.8rem;
    color: var(--lightGray);
    margin-bottom: 0;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 3rem;
}

.login-link {
    margin-top: 2rem;
    font-weight: 500;
}

@media (max-width: 700px) {
    .login-form {
        padding: 2rem 1rem;
        max-width: 90vw;
    }
    label {
        font-size: 1.7rem;
    }
    h1 {
        font-size: 2.4rem;
        margin-bottom: 3rem;
    }
}
</style>