<script lang="ts">
    import { Input, Button } from '$lib/components';
</script>

<div class="container">
    <div class="form-container">
        <h2>Register</h2>
        
        <form on:submit|preventDefault>
            <Input 
                type="text"
                name="username"
                placeholder="Enter your username"
            />

            <Input 
                type="email"
                name="email"
                placeholder="Enter your email"
                
            />
            
            <Input 
                type="password"
                
                name="password"
                placeholder="Enter your password"
                
            />

            <Input 
                type="password"
                
                name="confirmPassword"
                placeholder="Confirm your password"
                
            />
            
            <Button 
                type="submit" 
                variant="primary"
                text="Register"
            />

            <p class="center-text">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </form>
    </div>
</div>

<style>
    .container {
        min-height: calc(100vh - 8rem); /* subtract some space for header/footer if they exist */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .form-container {
        max-width: 45rem;
        width: 100%;
        padding: 2rem;
        background-color: var(--secondary);
        border-radius: var(--borderRadius);
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    a {
        color: var(--blue);
    }

    h2 {
        text-align: center;
        margin-bottom: 2rem;
    }
</style>