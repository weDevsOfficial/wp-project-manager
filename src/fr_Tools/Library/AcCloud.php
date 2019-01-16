<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 10/1/19
 * Time: 2:12 PM
 */

namespace WeDevs\PM\Tools\Library;
use ActiveCollab\SDK\Authenticator;
use ActiveCollab\SDK\Exceptions\Authentication;
use ActiveCollab\SDK\Exceptions\ListAccounts;
use ActiveCollab\SDK\ResponseInterface;
use InvalidArgumentException;

class AcCloud extends Authenticator
{
    /**
     * @var bool
     */
    private $accounts_and_user_loaded = false;

    /**
     * @var array
     */
    private $accounts;

    /**
     * Return Feather (Active Collab and up) accounts.
     *
     * @return array
     */
    public function getAccounts()
    {
        if (!$this->accounts_and_user_loaded) {
            $this->loadAccountsAndUser();
        }

        return $this->accounts;
    }

    /**
     * @var array
     */
    private $all_accounts;

    /**
     * Return all accounts that this user is involved with.
     *
     * @return array
     */
    public function getAllAccounts()
    {
        if (!$this->accounts_and_user_loaded) {
            $this->loadAccountsAndUser();
        }

        return $this->all_accounts;
    }

    /**
     * @var array
     */
    private $user;

    /**
     * Return user information (first name, last name and avatar URL).
     *
     * @return array
     */
    public function getUser()
    {
        if (!$this->accounts_and_user_loaded) {
            $this->loadAccountsAndUser();
        }

        return $this->user;
    }

    /**
     * @var string
     */
    private $intent;

    /**
     * @return string
     */
    private function getIntent()
    {
        if (!$this->accounts_and_user_loaded) {
            $this->loadAccountsAndUser();
        }

        return $this->intent;
    }

    /**
     * {@inheritdoc}
     */
    public function issueToken(...$arguments)
    {
        if (empty($arguments[0]) || !is_int($arguments[0])) {
            throw new InvalidArgumentException('Account ID is required');
        }

        $intent = $this->getIntent();

        $account_id = (integer) $arguments[0];

        if (empty($this->accounts[$account_id])) {
            throw new InvalidArgumentException("Account #{$account_id} not loaded");
        } else {
            $response = $this->getConnector()->post('https://app.activecollab.com/' . $account_id . '/api/v1/issue-token-intent', null, [
                'client_vendor' => $this->getYourOrgName(),
                'client_name' => $this->getYourAppName(),
                'intent' => $intent,
            ]);

            if ($response instanceof ResponseInterface && $response->isJson()) {
                return $this->issueTokenResponseToToken($response, $this->accounts[$account_id]['url']);
            } else {
                throw new Authentication('Invalid response');
            }
        }
    }

    /**
     * Load account and user details from Active Collab ID.
     */
    private function loadAccountsAndUser()
    {
        if (!$this->accounts_and_user_loaded) {
            $email_address = $this->getEmailAddress();
            $password = $this->getPassword();

            if (empty($email_address) || empty($password)) {
                throw new Authentication('Email address and password are required');
            }

            $response = $this->getConnector()->post('https://my.activecollab.com/api/v1/external/login', null, [
                'email' => $this->getEmailAddress(),
                'password' => $this->getPassword(),
            ]);

            if ($response instanceof ResponseInterface && $response->isJson()) {
                $result = $response->getJson();

                if (empty($result['is_ok'])) {
                    if (empty($result['message'])) {
                        throw new ListAccounts();
                    } else {
                        throw new ListAccounts($result['message']);
                    }
                } elseif (empty($result['user']) || empty($result['user']['intent'])) {
                    throw new ListAccounts('Invalid response');
                } else {
                    $this->accounts = $this->all_accounts = [];

                    if (!empty($result['accounts']) && is_array($result['accounts'])) {
                        foreach ($result['accounts'] as $account) {
                            $this->all_accounts[] = $account;

                            if ($account['class'] == 'FeatherApplicationInstance' || $account['class'] == 'ActiveCollab\Shepherd\Model\Account\ActiveCollab\FeatherAccount') {
                                $account_id = (integer) $account['name'];

                                $this->accounts[$account_id] = [
                                    'id' => (integer) $account['name'],
                                    'name' => $account['display_name'],
                                    'url' => $account['url'],
                                ];
                            }
                        }
                    }

                    $this->intent = $result['user']['intent'];
                    unset($result['user']['intent']);
                    $this->user = $result['user'];
                }
            } else {
                throw new Authentication('Invalid response');
            }
        }
    }
}
