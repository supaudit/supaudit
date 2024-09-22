
--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '4fd9db8b-58c7-4b0f-a0a1-89337a66a4ca', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user@supaudit.local","user_id":"68a5e475-df57-48c6-880e-53136253756f","user_phone":""}}', '2024-09-21 12:53:09.76563+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '68a5e475-df57-48c6-880e-53136253756f', 'authenticated', 'authenticated', 'user@supaudit.local', '$2a$10$fRBGlzUQKKXu8bxrp7REROhDwP5YXbnmjb/qRr19hO3Q/qAzA3ua.', '2024-09-21 12:53:09.768564+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-09-21 12:53:09.758477+00', '2024-09-21 12:53:09.768755+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('68a5e475-df57-48c6-880e-53136253756f', '68a5e475-df57-48c6-880e-53136253756f', '{"sub": "68a5e475-df57-48c6-880e-53136253756f", "email": "user@supaudit.local", "email_verified": false, "phone_verified": false}', 'email', '2024-09-21 12:53:09.762887+00', '2024-09-21 12:53:09.762985+00', '2024-09-21 12:53:09.762985+00', '25ca349a-8378-4f05-be27-0061ebf9c2df');
