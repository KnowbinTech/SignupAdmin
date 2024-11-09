<script lang="ts">
  import { UserStore } from "$lib/stores/data";
  import "../../../app.css";
  import logo from "$lib/images/SIGNUP_LOGO.png";
  import  { AxiosError } from 'axios';
  import API from "$lib/services/api";
  import { goto } from "$app/navigation";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import Sun from "svelte-radix/Sun.svelte";
  import Moon from "svelte-radix/Moon.svelte";
  import { toggleMode } from "mode-watcher";
  let login = {
    username: "",
    password: "",
  };

  const MAX_USERNAME_LENGTH = 30;
  const MAX_PASSWORD_LENGTH = 15;

  let Logo = logo;
  let usernameError = "";
  let passwordError = "";
  let generalError = "";

  async function loginFn() {
    try {
      usernameError = "";
      passwordError = "";
      generalError = "";

      if (!login.username) {
        usernameError = 'Username is required';
      } else if (login.username.length > MAX_USERNAME_LENGTH) {
        usernameError = `Username must not exceed ${MAX_USERNAME_LENGTH} characters`;
      }

      if (!login.password) {
        passwordError = 'Password is required';
      } else if (login.password.length > MAX_PASSWORD_LENGTH) {
        passwordError = `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`;
      }

      if (!usernameError && !passwordError) {
        const res = await API.post("/account/session/user/login/", {
          ...login,
        });

        // Check if res and res.data are defined
        if (!res || !res.data) {
          generalError = "Invalid response from the server";
          return;
        }

        if (res.status === 400) { // Bad Request
          if (res.data.non_field_errors && res.data.non_field_errors.length > 0) {
            generalError = res.data.non_field_errors[0];
          } else {
            generalError = res.data.message || 'Bad request';
          }
        } else {
          const user = res.data.user;

          // Additional check for user object
          if (user && user.username) {
            UserStore.set(user);
            await goto('/dashboard');
          } else {
            generalError = "User data is missing in the response";
          }
        }
      }
    } catch (error: any) {
      console.log("login:", error);
      const axiosError = error as AxiosError<{ message: string, non_field_errors: string[] }>;
      if (axiosError.response && axiosError.response.status === 400) {
        if (axiosError.response.data.non_field_errors && axiosError.response.data.non_field_errors.length > 0) {
          generalError = axiosError.response.data.non_field_errors[0];
        } else {
          generalError = axiosError.response.data.message || 'Bad request';
        }
      } else {
        generalError = "An error occurred during login";
      }
    }
  }
</script>

<Button on:click={toggleMode} variant="outline" size="icon">
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
<div
  class="flex min-h-full flex-col bg-background text-foreground justify-center px-6 py-12 lg:px-8"
>
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img
      class="mx-auto h-22 w-auto dark:invert"
      src={Logo}
      alt="Signup Casuals"
    />
    <!-- <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2> -->
  </div>

  <div
    class="mt-10 sm:mx-auto bg-background text-foreground sm:w-full sm:max-w-sm"
  >
    <form class="space-y-6" method="POST" action="?/signIn">
      <div>
        <Button
          type="submit"
          class="flex w-full justify-center  px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm  "
          >Sign in
        </Button>
      </div>
    </form>
  </div>
</div>
