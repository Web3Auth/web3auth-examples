import Foundation
import Web3Auth
import FirebaseCore
import FirebaseAuth

class ViewModel: ObservableObject {
    var web3Auth: Web3Auth?
    @Published var loggedIn: Bool = false
    @Published var user: Web3AuthState?
    @Published var isLoading = false
    @Published var navigationTitle: String = ""
    private var clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"
    private var network: Network = .sapphire_mainnet
    private var loginParams: W3ALoginParams!
    
    func setup() async throws {
        guard web3Auth == nil else { return }
        await MainActor.run(body: {
            isLoading = true
            navigationTitle = "Loading"
        })
        
        web3Auth = try await Web3Auth(W3AInitParams(
            clientId: clientId,
            network: network,
            redirectUrl: "web3auth.ios-firebase-example://auth",
            loginConfig: [
                TypeOfLogin.jwt.rawValue:
                        .init(
                            verifier: "w3a-firebase-demo",
                            typeOfLogin: .jwt,
                            clientId: self.clientId
                        )
            ],
            mfaSettings: MfaSettings(
                deviceShareFactor: MfaSetting(enable: true, priority: 1),
                backUpShareFactor: MfaSetting(enable: true, priority: 2),
                socialBackupFactor: MfaSetting(enable: true, priority: 3),
                passwordFactor: MfaSetting(enable: true, priority: 4)
            ),
            // 259200 allows user to stay authenticated for 3 days with Web3Auth.
            // Default is 86400, which is 1 day.
            sessionTime: 259200
            
            
        ))
        
        loginParams = try await prepareLoginParams()
        await MainActor.run(body: {
            if self.web3Auth?.state != nil {
                user = web3Auth?.state
                loggedIn = true
            }
            isLoading = false
            navigationTitle = loggedIn ? "UserInfo" : "SignIn"
        })
    }
    
    func launchWalletServices() {
        Task {
            do {
                try await web3Auth!.launchWalletServices(
                    chainConfig: ChainConfig(
                        chainId: "0xaa36a7",
                        rpcTarget: "https://eth-sepolia.public.blastapi.io"
                    )
                )
            } catch {
                print(error.localizedDescription)
            }
        }
    }
    
    func enableMFA() {
        Task {
            do {
                loginParams = try await prepareLoginParams()
                _ = try await self.web3Auth?.enableMFA(prepareLoginParams())
                
            } catch {
                print(error.localizedDescription)
            }
        }
    }
    
    func request(signature: @escaping(String) -> ()) {
        Task {
            do {
                var params = [Any]()
                let address: String? = Web3RPC(
                    user: web3Auth!.state!
                )?.address.toChecksumAddress()
                params.append("Hello, Web3Auth from iOS!")
                params.append(
                    address!
                )
                
                params.append("Web3Auth")
                
                let result = try await self.web3Auth?.request(
                    chainConfig: ChainConfig(
                        chainId: "0x89",
                        rpcTarget: "https://polygon.llamarpc.com"
                    ),
                    method: "personal_sign",
                    requestParams: params
                )
                
                if result!.success {
                    signature(result!.result!)
                } else {
                    signature(result!.error!)
                }
            } catch {
                print(error.localizedDescription)
            }
        }
    }
    
    func loginViaFirebaseEP() {
        Task{
            do {
                let res = try await Auth.auth().signIn(withEmail: "custom+id_token@firebase.login", password: "Welcome@W3A")
                self.loginParams = try await prepareLoginParams()
                let result = try await web3Auth?.login(loginParams)
                await MainActor.run(body: {
                    user = result
                    loggedIn = true
                })
                
            } catch let error {
                print("Error: ", error)
            }
        }
    }
    
    private func prepareLoginParams() async throws -> W3ALoginParams {
        let idToken = try await Auth.auth().currentUser?.getIDTokenResult(forcingRefresh: true)
        
        return W3ALoginParams(
            loginProvider: .JWT,
            dappShare: nil,
            extraLoginOptions: ExtraLoginOptions(display: nil, prompt: nil, max_age: nil, ui_locales: nil, id_token_hint: nil, id_token: idToken?.token, login_hint: nil, acr_values: nil, scope: nil, audience: nil, connection: nil, domain: nil, client_id: nil, redirect_uri: nil, leeway: nil, verifierIdField: "sub", isVerifierIdCaseSensitive: nil, additionalParams: nil),
            mfaLevel: .NONE,
            curve: .SECP256K1
        )
    }
    
    func logout() async throws {
        try  await web3Auth?.logout()
        
        await MainActor.run(body: {
            loggedIn.toggle()
        })
    }
    
    
}

extension ViewModel {
    func showResult(result: Web3AuthState) {
        print("""
        Signed in successfully!
            Private key: \(result.privKey ?? "")
                Ed25519 Private key: \(result.ed25519PrivKey ?? "")
            User info:
                Name: \(result.userInfo?.name ?? "")
                Profile image: \(result.userInfo?.profileImage ?? "N/A")
                Type of login: \(result.userInfo?.typeOfLogin ?? "")
        """)
    }
}
