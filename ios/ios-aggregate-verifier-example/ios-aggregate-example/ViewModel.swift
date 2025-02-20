import Foundation
import Web3Auth

class ViewModel: ObservableObject {
    lazy var web3Auth: Web3Auth? = nil
    @Published var loggedIn: Bool = false
    @Published var user: Web3AuthState?
    @Published var isLoading = false
    @Published var navigationTitle: String = ""
    private var clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"
    private var network: Network = .sapphire_mainnet
    
    func setup() async throws {
        guard web3Auth == nil else { return }
        await MainActor.run(body: {
            isLoading = true
            navigationTitle = "Loading"
        })
        web3Auth = try await Web3Auth(W3AInitParams(
            clientId: clientId, network: network,
            redirectUrl: "web3auth.ios-aggregate-example://auth",
            loginConfig: [
                TypeOfLogin.google.rawValue:
                        .init(
                            verifier: "aggregate-sapphire",
                            typeOfLogin: .google,
                            name: "Web3Auth-Aggregate-Verifier-Google-Example",
                            clientId: "519228911939-cri01h55lsjbsia1k7ll6qpalrus75ps.apps.googleusercontent.com",
                            verifierSubIdentifier: "w3a-google"
                        ),
                TypeOfLogin.jwt.rawValue:
                        .init(
                            verifier: "aggregate-sapphire",
                            typeOfLogin: .jwt,
                            name: "Web3Auth-Aggregate-Verifier-GitHub-Example",
                            clientId: "hiLqaop0amgzCC0AXo4w0rrG9abuJTdu",
                            verifierSubIdentifier: "w3a-a0-github"
                        )
            ],
            // 259200 allows user to stay authenticated for 3 days with Web3Auth.
            // Default is 86400, which is 1 day.
            sessionTime: 259200
        ))
        await MainActor.run(body: {
            if self.web3Auth?.state != nil {
                user = web3Auth?.state
                loggedIn = true
            }
            isLoading = false
            navigationTitle = loggedIn ? "UserInfo" : "Agg-Verifier Example"
        })
    }
    
    func loginWithGoogle() {
        Task{
            do {
                let result = try await web3Auth?.login(
                    W3ALoginParams(
                        loginProvider: .GOOGLE,
                        dappShare: nil,
                        extraLoginOptions: ExtraLoginOptions(display: nil, prompt: nil, max_age: nil, ui_locales: nil, id_token_hint: nil, id_token: nil, login_hint: nil, acr_values: nil, scope: nil, audience: nil, connection: nil, domain: nil, client_id: nil, redirect_uri: nil, leeway: nil, verifierIdField: nil, isVerifierIdCaseSensitive: nil, additionalParams: nil)
                    ))
                await MainActor.run(body: {
                    user = result
                    loggedIn = true
                })
            } catch {
                print("Error")
            }
        }
    }
    
    func loginWithGitHub() {
        Task{
            do {
                let result = try await web3Auth?.login(
                    W3ALoginParams(
                        loginProvider: .JWT,
                        dappShare: nil,
                        extraLoginOptions: ExtraLoginOptions(display: nil, prompt: nil, max_age: nil, ui_locales: nil, id_token_hint: nil, id_token: nil, login_hint: nil, acr_values: nil, scope: nil, audience: nil, connection: "github", domain: "https://web3auth.au.auth0.com", client_id: nil, redirect_uri: nil, leeway: nil, verifierIdField: "email", isVerifierIdCaseSensitive: false, additionalParams: nil)
                    ))
                await MainActor.run(body: {
                    user = result
                    loggedIn = true
                })
            } catch {
                print("Error")
            }
        }
    }
    
    func logout() async throws {
        try await web3Auth?.logout()
        await MainActor.run(body: {
            loggedIn = false
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
