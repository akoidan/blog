---
title: "Spring Boot CORS WebSecurity"
description: "Springboot has been blocked by Cross-Origin Resource Sharing. No 'Access-Control-Allow-Origin' header is present on the requested"
date: "5 Oct 2023"
tags: 
 - spring-boot
 - java
 - cors
---

## Understanding CORS is the key
Let's review why CORS is required in the first place. Let's say you open [fb.com](https://fb.com) from Chrome. 
Chrome makes a GET request to fb.com and sends all the cookies it stores for this site.

But if you open [malicious.site](https://www.malicious.site), and it makes a request to fb.com within XHR/form submition, your browser also sends cookies  **associated within fb.com** withing this request. Which means you got authorized, and malicious.site can read your fb.com data. We didn't want that thing to happen, ha?
This is exactly why CORS comes as a saver! And this is why if domains [which you send request from, and which you send request to] are different, browser must send `Origin: https://malicious.site` header. And your server should return `Access-Control-Allow-Origin: https://malicious.site`.
Keep in mind:
 - Backend should let the request go through, it shouldn't return any errors if you follow Web specification. It's the browser job to restrict access from reading response data.
 - If both origins are the same, your browser might not send `Origin` header in the request. Since it's not cross-origin resource sharing anymore. 
 - When `Origin` header is missing from requests, backend is not obligated to send `Access-Control-Allow-Origin` header in response as well. Keep that in mind during testing.

Ok, all of this is because of cookies. This simplifies a lot if you don't use it and store your credentials in e.g. localStorage. In this case feel free to return in backend responses:
```bash
Access-Control-Allow-Origin: *
```

Understanding these principles is the key to solving your issue.

## Adding CORS to spring-boot

I literally spent 3 hours fighting with sprint WebSecurity. Here's how you can do it:
```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val environment: Environment,
) {
    @Bean
    fun provideSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors { cors ->
            val config = CorsConfiguration()
            config.applyPermitDefaultValues()
            val allowedOrigin = environment.getProperty("CORS_ALLOWED_ORIGINS")
            if (allowedOrigin == null) {
                config.allowedOrigins = listOf("*")
            } else {
                config.allowedOrigins = allowedOrigin.split(' ')
            }
            config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE")
            cors.configurationSource { config }
        }
        http.csrf().disable()
```

You need to export environment `CORS_ALLOWED_ORIGINS` which is space separated value of origins (protocol + domain).
```bash
export CORS_ALLOWED_ORIGINS='http://localhost:8080 https://fb.com'
```
or
```bash
export CORS_ALLOWED_ORIGINS='http://localhost:8080'
```
This is domains which you allow access from to your backend. Note this is not a domain of your backend. You can also simplify this code with a star matching:
```kotlin
    @Bean
    fun provideSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors { cors ->
            val config = CorsConfiguration()
            config.applyPermitDefaultValues()
            config.allowedOrigins = listOf("*")
            config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE")
            cors.configurationSource { config }
        }
        http.csrf().disable()
```

Pay close attention to `config.applyPermitDefaultValues()`, without it spring-boot won't send CORS. 
