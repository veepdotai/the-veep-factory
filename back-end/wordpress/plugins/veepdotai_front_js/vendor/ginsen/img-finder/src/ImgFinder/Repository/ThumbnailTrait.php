<?php

declare(strict_types=1);

namespace ImgFinder\Repository;

use ImgFinder\RequestInterface;

trait ThumbnailTrait
{
    private function thumbnail(string $urlPhoto, RequestInterface $request, string $keyword = 'w'): string
    {
        $pattern = sprintf('~(.+)(&%s=\d+)(.*)~', $keyword);

        if (preg_match($pattern, $urlPhoto, $matches)) {
            $url = $matches[1] . "&$keyword=" . $request->widthSmall() . $matches[3];
        } else {
            $url = $urlPhoto . "&$keyword=" . $request->widthSmall();
        }

        return $url;
    }
}
