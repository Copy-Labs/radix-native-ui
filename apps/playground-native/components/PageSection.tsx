import {ActivityIndicator, ScrollView, View} from "react-native";
import * as React from "react";
import {ReactElement} from "react";
import {Ionicons} from "@expo/vector-icons";
import { router } from "expo-router";
import {LucideArrowLeft} from "lucide-react-native";
import { Flex, Heading, IconButton, Text, useTheme, useThemeMode } from 'radix-native-ui';
import { Icon } from '@/components/ui/icon-lucide';

type childrenProps = ReactElement | ReactElement[] | any | any[] | null;

export const CardSectionContainer = ({className, children}: {
  className?: string;
  children: ReactElement | ReactElement[] | null
}) => {
  return (
    <Flex
      direction={'column'}
      // className={cn("flex flex-col rounded-xl pb-4 bg-background dark:bg-base-300", className)}
    >
      {children}
    </Flex>
  )
}

export const CardSectionBody = ({className, children}: {
  className?: string;
  children: ReactElement | ReactElement[] | null
}) => {
  return (
    <View
      // className={cn("px-4", className)}
    >
      {children}
    </View>
  )
}

export const PageSectionContainer = ({classes, children}: { classes?: string; children?: ReactElement }) => {
  return (
    <View className={`flex flex-col pt-8 pb-8 ${classes}`}>
      {children}
    </View>
  )
}

export const PageSectionBody = ({classes, children}: { classes?: string; children?: ReactElement }) => {
  return (
    <View className={`${classes}`}>
      {children}
    </View>
  )
}

export const PageContainer = ({
  fallback,
  children,
}: {
  fallback?: ReactElement;
  children: ReactElement | ReactElement[] | any[];
}) => {
  const theme = useTheme();
  const mode = useThemeMode();

  // Access mode-specific colors
  const backgroundColor = mode === 'dark' ? theme.colors.gray.dark[2] : theme.colors.gray[2];

  return (
    <React.Suspense fallback={fallback || <ActivityIndicator size={'large'} />}>
      {/*<ThemedView>*/}
        <Flex backgroundColor={backgroundColor} direction={'column'} width={'100%'} height={'100%'} style={{ backgroundColor: backgroundColor}}>
          {children}
        </Flex>
      {/*</ThemedView>*/}
    </React.Suspense>
  );
};

export const PageHeading = ({ center = false, className, children }: { center?: boolean; className?: string; children: React.Component | React.Component[] | any | any[] }) => {
  return <Heading align={center ? 'center' : 'left'} size={5}>{children}</Heading>
}

export const PageHeader = ({ showBackButton = false, className, children }: { showBackButton?: boolean; className?: string; children: childrenProps }) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const themedBackIconColor = mode === 'dark' ? theme.colors.gray.dark['12'] : theme.colors.gray['11'];

  return (
    <Flex
      direction={'column'}
      height={64}
      justify={'center'}
      // className={cn("bg-primary-foreground flex flex-col justify-center h-16 px", className)}
    >
      {showBackButton ? (
        <Flex align={'center'} flex={1} gap={4}>
          <IconButton
            accessibilityLabel={'back button'}
            color={'gray'}
            variant={'ghost'}
            onPress={() => router.back()}
          >
            <Ionicons name={'arrow-back'} size={24} style={{ color: themedBackIconColor }} />
          </IconButton>
          {children}
        </Flex>
      ) : (
        /*<View className={"flex flex-row items-center gap-x-4"}>
          <Button className={"flex flex-row items-center rounded-lg"} variant={"ghost"} size={"icon"} onPress={() => router.back()}>
            <Text className={"flex flex-row items-center text-foreground"}>
              {/!*<Ionicons name={"arrow-back"} size={32} color={"inherit"} className={"text-foreground leading-tight"} />*!/}
              <Icon
                as={LucideArrowLeft}
                className={"[&_svg]:text-foreground leading-tight"}
                size={32}
                strokeWidth={4}
              />
            </Text>
          </Button>
          {children}
        </View>*/
        <Flex
          align={'center'}
          flex={1}
          justify={'center'}
          paddingHorizontal={4}
          // className={"flex flex-row flex-1 items-center px-4"}
        >
          {children}
        </Flex>
      )}
    </Flex>
  );
}

export const PageBody = ({ className, children }: { className?: string, children: ReactElement | ReactElement[] | any[] }) => {
  const theme = useTheme();
  const mode = useThemeMode();

  // Access mode-specific colors
  const backgroundColor = mode === 'dark' ? theme.colors.gray.dark[2] : theme.colors.gray[2];

  return <Flex
    direction={'column'}
    backgroundColor={'orange'}
    flex={1}
    width={'100%'}
    maxWidth={'100%'}
    // className={cn(className, "flex-1")}
    style={{ width: "100%", maxWidth: "100%", backgroundColor: backgroundColor }}
  >
    {children}
  </Flex>
}
