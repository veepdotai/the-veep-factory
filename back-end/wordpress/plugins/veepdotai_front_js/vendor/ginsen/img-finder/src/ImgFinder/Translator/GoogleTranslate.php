<?php

declare(strict_types=1);

namespace ImgFinder\Translator;

use Exception;
use ImgFinder\RequestInterface;
use Psr\Http\Client\ClientInterface;
use Symfony\Component\HttpClient\Psr18Client;

class GoogleTranslate implements TranslatorInterface
{
    private const NAME = 'google-translate';

    private ClientInterface $httpClient;


    public function __construct(
        private string $apikey,
        private string $from,
        private string $to
    ) {
        $this->httpClient = new Psr18Client();
    }


    public function name(): string
    {
        return self::NAME;
    }


    public function findWord(RequestInterface $request): RequestInterface
    {
        $url  = $this->makeUrl($request);
        $data = $this->doHttpRequest($url);

        return $this->createNewRequest($request, $data);
    }


    private function makeUrl(RequestInterface $request): string
    {
        return sprintf(
            'https://www.googleapis.com/language/translate/v2?key=%s&source=%s&target=%s&q=%s',
            $this->apikey,
            $this->from,
            $this->to,
            $request->urlWords()
        );
    }


    /**
     * @throws
     */
    private function doHttpRequest(string $url): iterable
    {
        try {
            $request  = $this->httpClient->createRequest('GET', $url);
            $response = $this->httpClient->sendRequest($request);
            $body     = $response->getBody()->getContents();

            return json_decode($body, true);
        } catch (Exception) {
            return [];
        }
    }


    private function createNewRequest(RequestInterface $request, iterable $data): RequestInterface
    {
        $translated = $data['data']['translations'][0]['translatedText'];

        if ($translated === $request->words()) {
            return $request;
        }

        return $request->setWords($translated);
    }
}
