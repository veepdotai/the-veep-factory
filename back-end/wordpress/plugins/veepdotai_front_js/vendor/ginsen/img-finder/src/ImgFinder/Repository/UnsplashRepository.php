<?php

declare(strict_types=1);

namespace ImgFinder\Repository;

use Exception;
use ImgFinder\Payload;
use ImgFinder\RequestInterface;
use ImgFinder\Response;
use ImgFinder\ResponseInterface;
use Psr\Http\Client\ClientInterface;
use Symfony\Component\HttpClient\Psr18Client;

class UnsplashRepository implements ImgRepositoryInterface
{
    public const NAME      = 'unsplash';
    public const URLS      = 'urls';
    public const RESULTS   = 'results';
    public const RAW       = 'raw';
    public const THUMB     = 'thumb';
    public const USER      = 'user';
    public const USER_NAME = 'name';
    public const LINKS     = 'links';
    public const HTML      = 'html';

    private ClientInterface $httpClient;

    use ThumbnailTrait;


    public function __construct(
        private string $authorization
    ) {
        $this->httpClient = new Psr18Client();
    }


    public function name(): string
    {
        return self::NAME;
    }


    public function findImages(RequestInterface $request): ResponseInterface
    {
        $url  = $this->makeUrl($request);
        $data = $this->doHttpRequest($url);

        return $this->createResponse($data, $request);
    }


    private function makeUrl(RequestInterface $request): string
    {
        return sprintf(
            'https://api.unsplash.com/search/photos?client_id=%s&query=%s&page=%s&per_page=%s&orientation=%s',
            $this->authorization,
            $request->urlWords(),
            $request->page(),
            $request->perPage(),
            $request->orientation()
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


    private function createResponse(iterable $data, RequestInterface $request): ResponseInterface
    {
        if (empty($data)) {
            return Response::fromUrls([]);
        }

        $response = [];

        foreach ($data[self::RESULTS] as $photo) {
            $thumbnail = $this->thumbnail($photo[self::URLS][self::THUMB], $request);
            $payload   = Payload::build(
                $this->name(),
                $photo[self::URLS][self::RAW],
                $thumbnail,
                $photo[self::USER][self::USER_NAME] ?: null,
                $photo[self::USER][self::LINKS][self::HTML] ?: null
            );
            $response[] = $payload->render();
        }

        return Response::fromUrls($response);
    }
}
