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

class PexelsRepository implements ImgRepositoryInterface
{
    public const NAME             = 'pexels';
    public const PHOTOS           = 'photos';
    public const SRC              = 'src';
    public const MEDIUM           = 'medium';
    public const PHOTOGRAPHER     = 'photographer';
    public const PHOTOGRAPHER_URL = 'photographer_url';

    private ClientInterface $httpClient;

    use ThumbnailTrait;


    public function __construct(
        private string $authorization)
    {
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
            'https://api.pexels.com/v1/search?query=%s&page=%d&per_page=%d&orientation=%s',
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
            $request  = $request->withHeader('Authorization', $this->authorization);
            $response = $this->httpClient->sendRequest($request);
            $body     = $response->getBody()->getContents();

            return (array) json_decode($body, true);
        } catch (Exception) {
            return [];
        }
    }


    private function createResponse(iterable $data, RequestInterface $request): ResponseInterface
    {
        if (empty($data)) {
            return Response::fromUrls([]);
        }

        $orientation = $request->orientation();
        $response    = [];

        foreach ($data[self::PHOTOS] as $photo) {
            $thumbnail = $this->thumbnail($photo[self::SRC][self::MEDIUM], $request);
            $payload   = Payload::build(
                $this->name(),
                $photo[self::SRC][$orientation],
                $thumbnail,
                $photo[self::PHOTOGRAPHER] ?: null,
                $photo[self::PHOTOGRAPHER_URL] ?: null
            );
            $response[] = $payload->render();
        }

        return Response::fromUrls($response);
    }
}
