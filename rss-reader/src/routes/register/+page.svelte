<script lang="ts">
    import { Input, Button } from '$lib/components';

    const buttonFontSize = "1.5rem";
    const buttonPadding = "1.4rem 0";
</script>

<div class="register-bg">
  <form class="register-form" on:submit|preventDefault>
    <h1>Welcome to RSS Reader</h1>

    <div class="field-group">
      <label for="username">Username</label>
      <Input id="username" name="username" type="text" placeholder="Username" />
    </div>

    <div class="field-group">
      <label for="email">Email</label>
      <Input id="email" name="email" type="email" placeholder="Email" />
    </div>

    <div class="field-group">
      <label for="password">Password</label>
      <Input id="password" name="password" type="password" placeholder="Password" />
    </div>

    <div class="button-group">
        <Button type="submit" text="Create account" variant="secondary" fontSize={buttonFontSize} padding={buttonPadding} />

        <div class="or-separator">
        <span>OR</span>
        </div>

        <Button type="button" text="Sign up with Google" variant="primary" fontSize={buttonFontSize} padding={buttonPadding} />
    </div>
    <div class="back-login-link">
      <a href="/login" class="discreet-link">¿Ya tienes cuenta? Inicia sesión</a>
    </div>
  </form>
</div>

<style>
.register-bg {
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-form {
  background: var(--darkPrimary);
  border-radius: var(--borderRadius);
  padding: 5rem 4rem 4rem 4rem;
  max-width: 55rem;
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
  margin-bottom: 1.5rem;
  font-size: 3.4rem;
  font-weight: 600;
  margin-bottom: 5rem;
}

label {
  font-size: 1.8rem;
  color: var(--lightGray);
  margin-bottom: 0;
}

.or-separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.2rem 0 0.5rem 0;
}
.or-separator span {
  flex: 1;
  color: var(--lightGray);
  font-size: 1.3rem;
  border-bottom: 1px solid var(--gray);
  line-height: 0.1em;
  margin: 0 1.5rem;
  background: var(--primary);
  padding: 0 1rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 3rem;
}

.back-login-link {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 700px) {
  .register-form {
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