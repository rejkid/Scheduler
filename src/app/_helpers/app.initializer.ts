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
          console.log("appInitializer2");
        },
        error: (error: string) => {
          
          console.log("Error in appInitializer");
        }
      })
      .add(resolve);
  }).then((message) => {
    console.log("appInitializer2");
  }).catch((message) => {
    console.log("Error in appInitializer");
  });
}

/* export function appInitializer(accountService: AccountService) {
      // attempt to refresh token on app start up to auto authenticate
      return () => accountService.refreshToken();
} */