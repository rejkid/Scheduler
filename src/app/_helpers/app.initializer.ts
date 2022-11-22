import { TeardownLogic } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
  return () => new Promise((resolve: any) => {
    // attempt to refresh token on app start up to auto authenticate
    //alert("Failed refreshing");
    accountService.refreshToken()
      .subscribe({
        next: (value: any) => {
          console.log(value);
        },
        error: (error: string) => {
          
          console.log(error);
        }
      })
      .add(resolve);
  }).then((message) => {
    console.log(message);
  }).catch((message) => {
    console.log(message);
  });
}

/* export function appInitializer(accountService: AccountService) {
      // attempt to refresh token on app start up to auto authenticate
      return () => accountService.refreshToken();
} */